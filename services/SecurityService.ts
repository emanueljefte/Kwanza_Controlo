// services/authSecurity.ts
import * as SecureStore from "expo-secure-store";

export const PIN_KEY = "user_app_pin";

export const SecurityService = {
  async savePin(pin: string) {
    await SecureStore.setItemAsync(PIN_KEY, pin);
  },
  async getPin() {
    return await SecureStore.getItemAsync(PIN_KEY);
  },
  async hasPin() {
    const pin = await this.getPin();
    return pin !== null;
  },
  async removePin() {
    await SecureStore.deleteItemAsync(PIN_KEY);
  }
};