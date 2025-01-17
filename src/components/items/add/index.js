import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import {useState} from "react";

import axios from "axios";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const {TextArea} = Input;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Add = ({getItems}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const [btnLoad, setBtnLoad] = useState(false);

  const handleCancelImg = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = (file) => {
    setFileList(file.fileList);
  };

  function getBasee64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{marginTop: 8}}>Зураг</div>
    </div>
  );
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
    if (fileList.length === 0) {
      message.error("Зураг заавал оруулна уу!");
    } else {
      setBtnLoad(true);
      const token = localStorage.getItem("idToken");
      const img = [];
      fileList.forEach((element) => {
        getBasee64(element.originFileObj, (imageUrl) => img.push(imageUrl));
      });

      const body = {
        localId: localStorage.getItem("localId"),
        data: {...values, image: img},
      };
      if (body.order === false) {
        delete body.data.order;
      }

      setTimeout(() => {
        axios
          .post(
            `https://bondooloi-kids-default-rtdb.firebaseio.com/items.json?&auth=${token}`,
            body
          )
          .then((res) => {
            if (res.data.name) message.success("Амжилттай");
            getItems();
          })
          .catch((err) => {
            message.error("Амжилтгүй");
          })
          .finally(() => {
            setIsModalOpen(false);
            setBtnLoad(false);
          });
      }, 800);
    }
  };
  const options = [
    {value: "Захиалга", label: "Захиалга"},
    {value: "Шинэ", label: "Шинэ"},
    {value: "Хувцас", label: "Хувцас"},
  ];
  return (
    <div>
      <Button
        type="primary"
        onClick={showModal}
        size="middle"
        style={{marginBottom: "10px", marginLeft: "10px", marginTop: "10px"}}
      >
        + Бараа нэмэх
      </Button>
      <Modal
        title="Нэмэх"
        open={isModalOpen}
        onCancel={handleCancel}
        width={"50%"}
        footer={null}
      >
        <Form
          disabled={btnLoad}
          size="middle"
          initialValues={{remember: true}}
          onFinish={onFinish}
          style={{marginTop: "20px"}}
        >
          <Upload
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 7 ? null : uploadButton}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancelImg}
          >
            <img alt="example" style={{width: "100%"}} src={previewImage} />
          </Modal>

          <Form.Item
            label="Барааны нэр"
            name="name"
            labelCol={{span: 4}}
            wrapperCol={{span: 20}}
            rules={[{required: true, message: "Барааны нэр ээ оруулна уу!"}]}
          >
            <Input placeholder="Барааны нэр" allowClear />
          </Form.Item>
          <Row gutter={4}>
            <Col>
              <Form.Item
                label="Үнэ"
                name="price"
                rules={[{required: true, message: "Үнэ ээ оруулна уу!"}]}
                labelCol={{span: 11}}
                wrapperCol={{span: 14}}
              >
                <InputNumber
                  style={{width: "100%"}}
                  defaultValue={1000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Үнэ"
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Хөнгөлөлт"
                name="discount"
                labelCol={{span: 14}}
                // wrapperCol={{span: 8}}
                rules={[{required: false}]}
              >
                <InputNumber max={99} placeholder="Хөнгөлөлт" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Тоо ширхэг"
                name="stock"
                labelCol={{span: 16}}
                // wrapperCol={{span: 12}}
                rules={[{required: true, message: "Тоо ширхэг оруулна уу!"}]}
              >
                <InputNumber placeholder="Тоо ширхэг" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col>
              <Form.Item
                label="*"
                name="order"
                valuePropName="checked"
                labelCol={{span: 23}}
                wrapperCol={{span: 8}}
                rules={[{required: false}]}
              >
                <Checkbox>Захиалга</Checkbox>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="*"
                name="new"
                valuePropName="checked"
                labelCol={{span: 23}}
                wrapperCol={{span: 10}}
                rules={[{required: false}]}
              >
                <Checkbox>Шинэ</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          {/* 
          <Form.Item
            label=""
            name="Категори"
            valuePropName="checked"
            labelCol={{span: 4}}
            wrapperCol={{span: 20}}
            rules={[{required: false, message: "Категори оруулна уу!"}]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            name="category"
            label="Категори"
            rules={[
              {
                required: true,
                message: "Категори оруулна уу!",
              },
            ]}
            labelCol={{span: 4}}
            wrapperCol={{span: 20}}
          >
            <Select mode="tags" options={options}></Select>
          </Form.Item>

          <Form.List name="additionalInfo">
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, ...restField}) => (
                  <div key={key}>
                    <Row gutter={22}>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          label="Гарчиг"
                          labelCol={{span: 8}}
                          wrapperCol={{span: 22}}
                          name={[name, "label"]}
                          rules={[{required: true, message: "Missing key"}]}
                        >
                          <Input
                            placeholder="Гарчиг"
                            className="w-full"
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          label="Утга"
                          labelCol={{span: 8}}
                          wrapperCol={{span: 22}}
                          name={[name, "value"]}
                          rules={[{required: true, message: "Missing key"}]}
                        >
                          <Input
                            placeholder="Утга"
                            className="w-full"
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.Item
                  wrapperCol={{
                    xl: {span: 18, offset: 6},
                    xs: {span: 20, offset: 0},
                  }}
                >
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Нэмэлт мэдээлэл
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            labelCol={{span: 6}}
            wrapperCol={{span: 20}}
            label="Богино дэлгэрэнгуй"
            name="shortDescription"
            rules={[
              {
                required: true,
                message: "Богино дэлгэрэнгуй мэдээлэл ээ оруулна уу!",
              },
            ]}
          >
            <TextArea
              placeholder="дэлгэрэнгуй"
              showCount
              allowClear
              style={{height: "100px"}}
            />
          </Form.Item>
          <Form.Item
            labelCol={{span: 6}}
            wrapperCol={{span: 20}}
            label="Бүтэн дэлгэрэнгуй"
            name="fullDescription"
            rules={[
              {
                required: true,
                message: "Дэлгэрэнгуй мэдээлэл ээ оруулна уу!",
              },
            ]}
          >
            <TextArea
              placeholder="дэлгэрэнгуй"
              showCount
              allowClear
              style={{height: "200px"}}
            />
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{width: "100%"}}
              loading={btnLoad}
            >
              {" "}
              Хадгалах{" "}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Add;
