export type Route = {
  title: string;
  link: string;
  icon: string;
  roles: string[];
  children?: Route[];
};

export type SubRoutesState = {
  [key: string]: boolean;
};

export const sidebarRoutes: Route[] = [
    // Admin routes
    {
        title: "Thống kê",
        link: "/admin/dashboard",
        icon: "fa-solid fa-chart-line",
        roles: ["ROLE_ADMIN"],
    },
    {
        title: "Chi nhánh",
        link: "/admin/branchlist",
        icon: "fa-solid fa-building",
        roles: ["ROLE_ADMIN"],
    },
    {
        title: "Nhân viên",
        link: "/admin/stafflist",
        icon: "fa-solid fa-users",
        roles: ["ROLE_ADMIN"],
    },
    {
        title: "Khách hàng",
        link: "/admin/customerlist",
        icon: "fa-solid fa-user",
        roles: ["ROLE_ADMIN"],
    },
    {
        title: "Đơn hàng",
        link: "/admin/orderlist",
        icon: "fa-solid fa-receipt",
        roles: ["ROLE_ADMIN"],
    },
    {
        title: "Sản phẩm",
        link: "/admin/productlist",
        icon: "fa-solid fa-box",
        roles: ["ROLE_ADMIN"],
    },
    {
        title: "Khuyến mãi",
        link: "/admin/promote",
        icon: "fa-solid fa-ticket",
        roles: ["ROLE_ADMIN"],
    },
    {
        title: "Đánh giá",
        link: "/admin/rating",
        icon: "fa-solid fa-star",
        roles: ["ROLE_ADMIN"],
    },

    // Manager routes
    {
        title: "Thống kê",
        link: "/manager/dashboard",
        icon: "fa-solid fa-chart-line",
        roles: ["ROLE_MANAGER"],
    },
    {
        title: "Nguyên liệu",
        link: "/manager/materiallist",
        icon: "fa-solid fa-boxes-stacked",
        roles: ["ROLE_MANAGER"],
    },
    {
        title: "Sản phẩm",
        link: "/manager/productlist",
        icon: "fa-solid fa-box",
        roles: ["ROLE_MANAGER"],
    },
    {
        title: "Đơn hàng",
        link: "/manager/orderlist",
        icon: "fa-solid fa-receipt",
        roles: ["ROLE_MANAGER"],
    },
    {
        title: "Nhân viên",
        link: "/manager/stafflist",
        icon: "fa-solid fa-users",
        roles: ["ROLE_MANAGER"],
    },
    {
        title: "Khách hàng",
        link: "/manager/customerlist",
        icon: "fa-solid fa-user",
        roles: ["ROLE_MANAGER"],
    },
    {
        title: "Khuyến mãi",
        link: "/manager/promote",
        icon: "fa-solid fa-ticket",
        roles: ["ROLE_MANAGER"],
    },
    {
        title: "Đánh giá",
        link: "/manager/rating",
        icon: "fa-solid fa-star",
        roles: ["ROLE_MANAGER"],
    },

    // Staff routes
    {
        title: "Đặt hàng",
        link: "/manager/order",
        icon: "fa-solid fa-cart-plus",
        roles: ["ROLE_STAFF"],
        children: [
            {
                title: "Chọn bàn",
                link: "/manager/choose-table",
                icon: "fa-solid fa-mug-saucer",
                roles: ["ROLE_STAFF"],
            },
            {
                title: "Gọi món",
                link: "/manager/place-order",
                icon: "fa-solid fa-cart-plus",
                roles: ["ROLE_STAFF"],
            },
            {
                title: "Danh sách đơn hàng",
                link: "/manager/order-list",
                icon: "fa-solid fa-receipt",
                roles: ["ROLE_STAFF"],
            },
        ],
    },
    {
        title: "Danh sách khách hàng",
        link: "/manager/customer-list",
        icon: "fa-solid fa-users",
        roles: ["ROLE_STAFF"],
    },
    {
        title: "Thông tin nhân viên",
        link: "/manager/info",
        icon: "fa-solid fa-user",
        roles: ["ROLE_STAFF"],
    },

    // Customer routes
    {
        title: "Trang chủ",
        link: "/",
        icon: "fa-solid fa-house",
        roles: ["ROLE_CUSTOMER"],
    },
    {
        title: "Giới thiệu",
        link: "/about-us",
        icon: "fa-solid fa-circle-info",
        roles: ["ROLE_CUSTOMER"],
    },
    {
        title: "Liên hệ",
        link: "/contact-us",
        icon: "fa-solid fa-phone",
        roles: ["ROLE_CUSTOMER"],
    },
    {
        title: "Đặt phòng",
        link: "/booking",
        icon: "fa-solid fa-calendar",
        roles: ["ROLE_CUSTOMER"],
    },
    {
        title: "Lịch sử",
        link: "/history",
        icon: "fa-solid fa-clock-rotate-left",
        roles: ["ROLE_CUSTOMER"],
    },
    {
        title: "Thông tin cá nhân",
        link: "/profile-user",
        icon: "fa-solid fa-user",
        roles: ["ROLE_CUSTOMER"],
    },
]