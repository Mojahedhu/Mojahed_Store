
```
react-E-commerce
├─ .dockerignore
├─ .env
├─ backend
│  ├─ .env
│  ├─ @types
│  │  └─ express
│  │     └─ index.d.ts
│  ├─ config
│  │  └─ db.ts
│  ├─ controllers
│  │  ├─ categoryController.ts
│  │  ├─ cloudinaryController.ts
│  │  ├─ orderController.ts
│  │  ├─ productController.ts
│  │  ├─ stripeController.ts
│  │  ├─ userController.ts
│  │  └─ webhookController.ts
│  ├─ index.ts
│  ├─ middlewares
│  │  ├─ asyncHandler.ts
│  │  ├─ authMiddleware.ts
│  │  ├─ checkId.ts
│  │  ├─ errorHandler.ts
│  │  └─ multerErrorHandler.ts
│  ├─ models
│  │  ├─ categoryModel.ts
│  │  ├─ OrderModel.ts
│  │  ├─ productModel.ts
│  │  └─ userModel.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ read.md
│  ├─ routes
│  │  ├─ categoryRoutes.ts
│  │  ├─ cloudinaryRoutes.ts
│  │  ├─ orderRoutes.ts
│  │  ├─ productRoutes.ts
│  │  ├─ stripeWebhookRoutes.ts
│  │  ├─ uploadRoutes.ts
│  │  ├─ userRoutes.ts
│  │  └─ webhookRoutes.ts
│  ├─ services
│  │  ├─ cloudinaryDelete.ts
│  │  ├─ cloudinaryService.ts
│  │  └─ paypalServices.ts
│  ├─ tsconfig.json
│  ├─ uploads
│  │  ├─ image-1768643640333.webp
│  │  ├─ image-1768727400145.jpg
│  │  ├─ image-1768743746310.png
│  │  ├─ image-1769079656945.webp
│  │  ├─ image-1769079817204.jpg
│  │  ├─ image-1769080029554.webp
│  │  ├─ image-1769080389006.jpg
│  │  ├─ image-1769080574735.jpg
│  │  ├─ image-1769080904098.webp
│  │  ├─ image-1769082188036.avif
│  │  └─ image-1769082349257.avif
│  ├─ utils
│  │  ├─ AppError.ts
│  │  ├─ createToken.ts
│  │  ├─ helper.ts
│  │  └─ stripe.ts
│  └─ _package.json
├─ docker-compose.yml
├─ Dockerfile
├─ frontEnd
│  ├─ .env
│  ├─ .flowbite-react
│  │  ├─ class-list.json
│  │  ├─ config.json
│  │  └─ init.tsx
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ shop-svgrepo-com.svg
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ components
│  │  │  ├─ CategoryForm.tsx
│  │  │  ├─ CheckoutCard.tsx
│  │  │  ├─ ConfirmDialogue.tsx
│  │  │  ├─ Dropdown.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ Loader.tsx
│  │  │  ├─ Message.tsx
│  │  │  ├─ Modal.tsx
│  │  │  ├─ Order.tsx
│  │  │  ├─ PrivateRoute.tsx
│  │  │  ├─ Progress.tsx
│  │  │  └─ ProgressSteps.tsx
│  │  ├─ config
│  │  │  └─ constants.ts
│  │  ├─ hooks
│  │  │  ├─ debounce.ts
│  │  │  └─ useAutoHeight.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ Admin
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminMenu.tsx
│  │  │  │  ├─ AdminRoute.tsx
│  │  │  │  ├─ AllProducts.tsx
│  │  │  │  ├─ CategoryList.tsx
│  │  │  │  ├─ OrderList.tsx
│  │  │  │  ├─ ProductList.tsx
│  │  │  │  ├─ ProductUpdate.tsx
│  │  │  │  └─ UserList.tsx
│  │  │  ├─ Auth
│  │  │  │  ├─ Login.tsx
│  │  │  │  ├─ navigation.module.css
│  │  │  │  ├─ Navigation.tsx
│  │  │  │  └─ Register.tsx
│  │  │  ├─ Cart.tsx
│  │  │  ├─ Home.tsx
│  │  │  ├─ orders
│  │  │  │  ├─ PlaceOrder.tsx
│  │  │  │  └─ Shipping.tsx
│  │  │  ├─ products
│  │  │  │  ├─ Favorites.tsx
│  │  │  │  ├─ FavoritesCount.tsx
│  │  │  │  ├─ HeartIcon.tsx
│  │  │  │  ├─ Product.tsx
│  │  │  │  ├─ ProductCard.tsx
│  │  │  │  ├─ ProductCarousel.tsx
│  │  │  │  ├─ ProductDetails.tsx
│  │  │  │  ├─ ProductTaps.tsx
│  │  │  │  ├─ Rating.tsx
│  │  │  │  └─ SmallProduct.tsx
│  │  │  ├─ Shop.tsx
│  │  │  └─ User
│  │  │     ├─ Profile.tsx
│  │  │     └─ UserOrder.tsx
│  │  ├─ providers
│  │  │  └─ StripeProvider.tsx
│  │  ├─ redux
│  │  │  ├─ app
│  │  │  │  ├─ hooks.ts
│  │  │  │  └─ store.ts
│  │  │  ├─ constants
│  │  │  │  └─ endpoints.ts
│  │  │  ├─ features
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ authApi.ts
│  │  │  │  │  ├─ authSlice.ts
│  │  │  │  │  ├─ authTypes.ts
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ cart
│  │  │  │  │  └─ cartSlice.ts
│  │  │  │  ├─ category
│  │  │  │  │  ├─ categoryApiSlice.ts
│  │  │  │  │  └─ categoryTypes.ts
│  │  │  │  ├─ favorites
│  │  │  │  │  └─ favoriteSlice.ts
│  │  │  │  ├─ order
│  │  │  │  │  ├─ orderApiSlice.ts
│  │  │  │  │  └─ orderTypes.ts
│  │  │  │  ├─ product
│  │  │  │  │  ├─ productApiSlice.ts
│  │  │  │  │  └─ productsTypes.ts
│  │  │  │  ├─ shop
│  │  │  │  │  ├─ shopSlice.ts
│  │  │  │  │  └─ shopTypes.ts
│  │  │  │  └─ users
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ usersApi.ts
│  │  │  │     ├─ userSlice.ts
│  │  │  │     └─ usersTypes.ts
│  │  │  └─ services
│  │  │     └─ api.ts
│  │  ├─ stripeAsuncPayment.ts
│  │  └─ Utils
│  │     ├─ cartUtils.ts
│  │     ├─ handleCatchError.ts
│  │     └─ localStorage.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ package-lock.json
├─ package.json
├─ test.js
└─ tsconfig.json

```