"use client";
import React, { ReactNode, useEffect, useState } from "react";
import {
  MenuUnfoldOutlined,
  UserOutlined,
  FolderAddOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Row,
  Col,
  Avatar,
  Drawer,
  Space,
  Popover,
  Dropdown,
  Typography,
} from "antd";
import Link from "next/link";
// import config from '@/config';
// import ProgressBar from '@/components/ProgressBar/ProgressBar';
// import BreadcrumbAdmin from '@/components/BreadcrumbAdmin';
// import images from '@/assets';
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import config from "@/config";


const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: <Link href={"/admin/dashboard"}>Dashboard</Link>,
  },
  {
    key: "sub1",
    icon: <ShopOutlined />,
    label: "Products",
    children: [
      {
        key: "2",
        label: <Link href={"/admin/products"}>List Products</Link>,
      },
      {
        key: "3",
        label: <Link href={"/admin/products/add"}>Add Product</Link>,
      },
    ],
  },
  {
    key: "sub2",
    icon: <ShoppingCartOutlined />,
    label: "Orders",
    children: [
      {
        key: "4",
        label: <Link href={"/admin/orders"}>List Orders</Link>,
      },
      // {
      //   key: "5",
      //   label: <Link href={"/admin/orders/statistics"}>Order Statistics</Link>,
      // },
    ],
  },
  {
    key: "sub3",
    icon: <UserOutlined />,
    label: "Users",
    children: [
      { key: "6", label: <Link href={"/admin/users"}>List Users</Link> },
      // { key: "7", label: <Link href={"/admin/users/add"}>Add User</Link> },
    ],
  },
  {
    key: "sub4",
    icon: <AppstoreOutlined />,
    label: "Categories",
    children: [
      {
        key: "8",
        label: <Link href={"/admin/categories"}>List Categories</Link>,
      },
    ],
  },
  {
    key: "sub5",
    icon: <FileTextOutlined />,
    label: "Materials",
    children: [
      {
        key: "10",
        label: <Link href={"/admin/materials"}>List Materials</Link>,
      },
    ],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const urlAuth: string[] = [config.routesAdmin.login, config.routesAdmin.logout];
  const authPage = urlAuth.some((url: string) => pathname.startsWith(url));
  const dataUser = useSelector((state: any) => state.auth.login.currentUser);
  const adminUser = useSelector(
    (state: any) => state.adminAuth.login.currentAdmin
  );
  const [visible, setVisible] = useState<boolean>(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (authPage) {
    return <>{children}</>;
  }
  return (
    <Layout>
      <Drawer
        title={false}
        placement={"left"}
        closable={true}
        onClose={() => setVisible(false)}
        open={visible}
        key={"left"}
        width={250}
      >
        <Layout>
          <Sider
            trigger={null}
            width={210}
            className={"sider-primary ant-layout-sider-primarys "}
          >
            <div className="brand flex items-center justify-center pt-0 pb-7 px-14 bg-[#ffffff]">
              <Link href={"/admin/dashboard"} className="contents">
                <Image
                  src={"/favicon.ico"}
                  alt="Logo"
                  width={30}
                  height={30}
                  className="mr-2"
                />
                <span className={`text-[#000] align-middle ml-5 font-bold `}>
                  Ecomerce Dashboard
                </span>
              </Link>
            </div>
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={menuItems}
            />
          </Sider>
        </Layout>
      </Drawer>

      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {}}
        trigger={null}
        width={210}
        style={{ minHeight: "100vh" }}
      >
        <div className="brand flex items-center justify-center  pt-14 pb-7 px-14">
          <Link href={"/admin/dashboard"} className="contents">
            <Image
              src={"/favicon.ico"}
              alt="Logo"
              width={30}
              height={30}
              className="mr-2"
            />
            <span className={`text-[#ffffff] align-middle ml-5 font-bold `}>
              Ecomerce Dashboard
            </span>
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          className="mt-6"
        />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer, height: "auto" }}
        >
          <Row
            className="!p-5 m-0 lg:!mt-6 lg:!mx-10 md:!mt-4 md:!mx-8 sm:!mt-5 max-sm:!mt-5"
            style={{
              background: colorBgContainer,
            }}
          >
            <Col span={24} xs={5} sm={4} md={3} xl={0}>
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setVisible(true)}
                style={{ fontSize: "16px", width: 64, height: 64 }}
                className={"btn-sidebar-toggler lg:!hidden"}
              />
            </Col>
            {/* <Col span={24} xs={17} sm={16} md={15} xl={21}>
                            <div className="ant-page-header-heading  md:ml-0 max-md:ml-0 max-sm:!ml-7 ">
                                <BreadcrumbAdmin />
                            </div>
                        </Col> */}
            <Col
              span={24}
              xs={2}
              sm={4}
              md={6}
              xl={3}
              className="flex justify-end items-center"
            >
              {adminUser && (
                <span className="mr-3 text-sm font-medium hidden md:inline">
                  {adminUser.user_name ||
                    adminUser.username ||
                    adminUser.email ||
                    "Admin"}
                </span>
              )}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      icon: <UserOutlined />,
                      label: "Profile",
                    },
                    {
                      key: "2",
                      icon: <SettingOutlined />,
                      label: "Settings",
                    },
                    {
                      type: "divider",
                    },
                    {
                      key: "3",
                      icon: <LogoutOutlined />,
                      label: <Link href={config.routesAdmin.logout}>Logout</Link>,
                      danger: true,
                    },
                  ],
                }}
                placement="bottomRight"
                arrow
              >
                <div className="cursor-pointer flex items-center">
                  <Avatar
                    size="large"
                    style={{
                      backgroundColor: "#1890ff",
                    }}
                  >
                    {adminUser?.user_name?.charAt(0)?.toUpperCase() ||
                      adminUser?.username?.charAt(0)?.toUpperCase() ||
                      adminUser?.email?.charAt(0)?.toUpperCase() || (
                        <UserOutlined />
                      )}
                  </Avatar>
                </div>
              </Dropdown>
            </Col>
          </Row>
        </Header>

        <div className="ant-container-content-custom- flex-auto min-h-0 p-0 !mx-10 !my-16  max-sm:!mx-0 max-sm:!my-0 xl:!m-24 xl:!my-20">
          <Content className="!p-14 rounded-lg bg-[#eaeaea96] max-sm:!p-11">
            {children}
          </Content>
        </div>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
