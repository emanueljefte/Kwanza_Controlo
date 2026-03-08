// import { FontAwesome as Icon } from "@expo/vector-icons";
import Icons from "phosphor-react-native";
import { ReactNode } from "react";
import {
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};

export type ModalWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
};

export type accountOptionsType = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: any;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export type IconComponent = React.ComponentType<{
  height?: number;
  width?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}>;

export type IconType = {
  name: string;
  color?: string;
  size?: number;
};

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: TextStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

export interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  hasShadow?: boolean;
  children: React.ReactNode;
}

export type ImageUploadProps = {
  file?: any;
  onSelect: (file: any) => any;
  onClear: () => void;
  containerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
};

export type UserType = {
  uid?: string;
  email?: string | null;
  name: string | null;
  image?: any;
  is_dirty?: number;
  updated_at?: string;
  last_login?: string;
} | null;

export type UserDataType = {
  name: string;
  image?: any;
  is_dirty?: number;
  update_at?: string;
};

export type AuthContextType = {
  user: UserType;
  setUser: Function;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; msg?: string }>;
  // updateUserData: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
  enterAsGuest: () => Promise<void>;
  updateUserData?: (uid: string) => Promise<void>;
  isAuthenticated: boolean;
  isGuest: boolean;
  isOnline: boolean;
  isReady: boolean;
};

export type ResponseType = {
  success: boolean;
  data?: any;
  msg?: string;
};

export type WalletType = {
  id?: number;
  name: string;
  amount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  image: any;
  user?: string;
  created?: Date | string;
  is_dirty?: number;
};

export type IconProps = {
  name: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
};

export type HeaderProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type BackButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
  onPress?: () => void;
};

export type TransactionType = {
  id?: number;
  type: string;
  amount: number;
  category?: string;
  date: Date | string;
  description?: string;
  image?: any;
  user?: string;
  walletId: number;
};

export type CategoryType = {
  label: string;
  value: string;
  icon: keyof typeof Icons;
  bgColor: string;
};

export type TransactionItemProps = {
  item: TransactionType;
  index: number;
  handleClick: Function;
};

export type TransactionListType = {
  data: TransactionType[];
  title?: string;
  loading?: boolean;
  emptyListMessage?: string;
};

export type ExpenseCategoriesType = {
  [key: string]: CategoryType;
};

export type NotificationType = {
  id?: string;
  schedule_id?: string;
  title: string;
  frequency: number;
  schedule_date: Date | string;
  schedule_time: Date | string;
  user?: string;
  body?: string;
  active?: boolean;
};
