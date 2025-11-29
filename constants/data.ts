import { CategoryType, ExpenseCategoriesType } from "@/types"

export const TransactionType = [
    {label: "Expense", value: "expense"},
    {label: "Income", value: "income"},
]

export const incomeCategory: CategoryType = {
    label: "Income",
    value: "income",
    icon: "dollar",
    bgColor: "#16a34a"
}

export const expenseCategories: ExpenseCategoriesType = {
    groceries: {
        label: "Groceries",
        value: "groceries",
        icon: "shopping-cart",
        bgColor: "#485563"
    },
    rent: {
        label: "Rent",
        value: "rent",
        icon: "home",
        bgColor: "#075905"
    },
    utilities: {
        label: "Utilities",
        value: "utilities",
        icon: "lightbulb-o",
        bgColor: "#ca8a04"
    },
    transportation: {
        label: "Transportation",
        value: "transportation",
        icon: "car",
        bgColor: "#b45309"
    },
    
}