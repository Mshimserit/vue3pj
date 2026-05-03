import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

// 懒加载组件
const Layout = () => import('@/views/layout/index.vue')
const Home = () => import('@/views/home/index.vue')
const Login = () => import('@/views/login/index.vue')
const Category = () => import('@/views/category/index.vue')
const SubCategory = () => import('@/views/subCategory/index.vue')
const Detail = () => import('@/views/detail/index.vue')
const CartList = () => import('@/views/cartList/index.vue')
const CheckOut = () => import('@/views/checkout/index.vue')
const Pay = () => import('@/views/pay/index.vue')
const PayBack = () => import('@/views/pay/PayBack.vue')
const Member = () => import('@/views/member/index.vue')
const UserInfo = () => import('@/views/member/components/UserInfo.vue')
const UserOrder = () => import('@/views/member/components/UserOrder.vue')
const UserAddress = () => import('@/views/member/components/UserAddress.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: Layout,
            children: [
                {
                    path: '',
                    component: Home
                },
                {
                    path: 'category/:id',
                    component: Category
                },
                {
                    path: 'category/sub/:id',
                    component: SubCategory
                },
                {
                    path: 'detail/:id',
                    component: Detail
                },
                {
                    path: 'cartlist',
                    component: CartList
                },
                {
                    path: 'checkout',
                    component: CheckOut
                },
                {
                    path: 'pay',
                    component: Pay
                },
                {
                    path: 'paycallback',
                    component: PayBack
                },
                {
                    path: 'member',
                    component: Member,
                    children: [
                        {
                            path: '',
                            component: UserInfo
                        },
                        {
                            path: 'order',
                            component: UserOrder
                        },
                        {
                            path: 'address',
                            component: UserAddress
                        }
                    ]
                },
            ]
        },
        {
            path: '/login',
            component: Login
        }
    ],
    //路由滚动行为定制
    scrollBehavior() {
        return { top: 0 }
    }
})

// 注册路由守卫
setupGuards(router)

export default router
