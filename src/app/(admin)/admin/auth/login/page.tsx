"use client";
// import images from '@/assets';
import Image from "next/image";
import React, { useState } from "react";
import { Button, Checkbox, Form, Grid, Input, theme, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  adminLoginStart,
  adminLoginSuccess,
  adminLoginFailed,
} from "@/redux/adminAuthSlice";
import { useRouter } from "next/navigation";
import AuthSpinLoading from "@/components/AuthSpinLoading";
import config from "@/config";

import { authAdminLogin } from "@/services/adminAuthServices";
import { AdminLoginFormValues, ApiError } from "@/types/client";
import { Dispatch } from "redux";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function PageAdminLogin() {
  const router = useRouter();
  const dispatch: Dispatch = useDispatch();
  const [form] = Form.useForm<AdminLoginFormValues>();
  const [isFailedLogin, setIsFailedLogin] = useState<boolean>(false);
  const [isFailedToken, setFailedToken] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useToken();
  const screens = useBreakpoint();

  const styles: any = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
    errorText: {
      color: token.colorError,
      textAlign: "center",
      marginTop: "-12px",
      marginBottom: token.marginSM,
    },
  };

  const onFinish = async (values: AdminLoginFormValues) => {
    try {
      setIsFailedLogin(false);
      setFailedToken(false);
      setLoading(true);
      dispatch(adminLoginStart());

      const response = await authAdminLogin(values);

      if (response) {
        dispatch(adminLoginSuccess(response));
        await router.push(config.routesAdmin.dashboard);
      }
    } catch (error: ApiError | any) {
      dispatch(adminLoginFailed());

      if (error.response?.status === 404 || error.response?.status === 403) {
        setIsFailedLogin(true);
        setFailedToken(false);
        form.setFieldValue("password", "");
      } else if (error.response?.status === 400) {
        setFailedToken(true);
        setIsFailedLogin(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.section}>
      <div style={{ ...styles.container, position: "relative" }}>
        <AuthSpinLoading loading={loading} />
        <div style={styles.header}>
          <Image
            src={"/next.svg"}
            alt="Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <Title style={styles.title}>Admin Login</Title>
          <Text style={styles.text}>Welcome You To ZenFit Dashboard</Text>
        </div>
        <Form
          form={form}
          name="admin_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
          preserve={false}
        >
          <Form.Item
            name="usernameOrEmail"
            rules={[
              {
                required: true,
                message: "Please input your username or email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Username or Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          {isFailedLogin && (
            <Text type="danger" style={styles.errorText}>
              Invalid credentials or insufficient permissions
            </Text>
          )}
          {isFailedToken && !isFailedLogin && (
            <Text type="danger" style={styles.errorText}>
              Please complete the Captcha!
            </Text>
          )}

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link style={styles.forgotPassword} href="#">
              Forgot password?
            </Link>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
