import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { getSession } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/server-data";

export default async function EmployeesPage() {
  const session = await getSession();
  const snapshot = await getDashboardSnapshot(session);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Employees"
        title="Employee Performance"
        description="Compare completion, turnaround, overdue exposure, and current productivity tier across officers."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {snapshot.employees.map((employee) => (
          <EmployeeCard key={employee.employeeId} employee={employee} />
        ))}
      </div>

      <EmployeeTable employees={snapshot.employees} />
    </div>
  );
}
