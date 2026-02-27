import { CategoryType, ExpenseCategoriesType } from "@/types";

export const transactionType = [
    { label: "Despesa", value: "expense" },
    { label: "Entrada", value: "income" },
]

export const incomeCategory: CategoryType = {
    label: "Entrada",
    value: "income",
    icon: "MoneyIcon",
    bgColor: "#16a34a"
}

export const expenseCategories: ExpenseCategoriesType = {
    Moradia: {
        label: "Moradia",
        value: "house",
        icon: "HouseIcon",
        bgColor: "#795548"
    },
    Alimentação: {
        label: "Alimentação",
        value: "food",
        icon: "ForkKnifeIcon",
        bgColor: "#ffc107"
    },
    Saúde: {
        label: "Saúde",
        value: "health",
        icon: "HeartIcon",
        bgColor: "#e91e63"
    },
    Propinas: {
        label: "Propinas",
        value: "receipt",
        icon: "ReceiptIcon",
        bgColor: "#4caf50"
    },
    Família: {
        label: "Família",
        value: "family",
        icon: "UsersIcon",
        bgColor: "#ffc107"
    },
    Transporte: {
        label: "Transporte",
        value: "transportation",
        icon: "CarIcon",
        bgColor: "#2196f3"
    },
    Estudos: {
        label: "Estudos",
        value: "Studies",
        icon: "BookIcon",
        bgColor: "#e91e63"
    },
    Entretenimento: {
        label: "Entretenimento",
        value: "entretainement",
        icon: "GameControllerIcon",
        bgColor: "#ff9800"
    },
    Mercado: {
        label: "Mercado",
        value: "shopping",
        icon: "ShoppingCartIcon",
        bgColor: "#2196f3"
    },
    Comunicação: {
        label: "Comunicação",
        value: "network",
        icon: "PhoneIcon",
        bgColor: "#9c27b0"
    },
    Outras: {
        label: "Outras",
        value: "other",
        icon: "FileIcon",
        bgColor: "#9e9e9e"
    },

}