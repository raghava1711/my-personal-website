import { CrudManager } from "@/components/CrudManager";
import { expenseCategories } from "@/lib/constants";

export default function ExpensesPage() {
  return (
    <CrudManager
      title="Expenses"
      description="Track private expenses by name, amount, category, date, and notes. Dashboard summaries calculate totals and category breakdowns from these records."
      endpoint="/api/expenses"
      primaryKey="name"
      secondaryKey="category"
      fields={[
        { key: "name", label: "Expense Name", required: true },
        { key: "amount", label: "Amount", type: "number", required: true },
        { key: "category", label: "Category", type: "select", options: expenseCategories },
        { key: "spentAt", label: "Date", type: "date" },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      empty="No expenses yet. Add your first expense."
    />
  );
}
