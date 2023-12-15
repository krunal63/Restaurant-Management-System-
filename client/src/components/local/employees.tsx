import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../config";

export interface EmployeeState {
  employeeId: number;
  name: string;
  contact: string;
}

export default function Employees() {
  const [employeeData, setEmployeeData] = useState<EmployeeState[]>();

  const fetchEmployees = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Employees`).then((res) => {
      setEmployeeData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const ondeleteEmployee = useCallback(
    (employeeId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Employees/${employeeId}`).then(() => {
        fetchEmployees();
      });
    },
    [fetchEmployees]
  );

  return (
    <>
      <h1 className="ml-6 my-6 text-2xl font-bold">Employees</h1>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {employeeData?.map((employee) => (
              <TableRow key={employee.employeeId}>
                <TableCell>{employee.employeeId}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.contact}</TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => ondeleteEmployee(employee.employeeId)}
                  >
                    <Trash></Trash>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
