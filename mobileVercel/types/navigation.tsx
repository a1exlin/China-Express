// types/navigation.tsx
export type RootStackParamList = {
    Home: undefined
    Menu: undefined
    Cart: undefined
    Checkout: undefined
    OrderConfirmation: {
      orderNumber: string
      total: number
      orderType: "delivery" | "pickup"
    }
    Track: {
      orderId: string
    }
  }
  