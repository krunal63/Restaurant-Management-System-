import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Check, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { EmployeeState } from "./employees";
import { TableState } from "./tables";
import { ItemState } from "./items";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface StatisticsState {
  totalTables: number;
  totalEmployees: number;
  totalCompletedOrders: number;
  totalRevenue: number;
}

interface OrderState {
  orderId: number;
  isCompleted: boolean;
  table: {
    name: string;
  };
  employee: {
    name: string;
  };
  item: {
    name: string;
  };
}

export default function Dashboard() {
  const [statistics, setStatistics] = useState<StatisticsState>();
  const [orderData, setOrderData] = useState<OrderState[]>();

  const fetchStatistics = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Orders/statistics`).then((res) => {
      setStatistics(res.data);
    });
  }, []);

  const fetchOrders = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Orders`).then((res) => {
      setOrderData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchStatistics();
    fetchOrders();
  }, [fetchOrders, fetchStatistics]);

  const ondeleteOrder = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Orders/${tableId}`).then(() => {
        fetchOrders();
        fetchStatistics();
      });
    },
    [fetchOrders, fetchStatistics]
  );

  const onUpdateOrder = useCallback(
    (tableId: number) => {
      axios.put(`${env.SERVER_URL}/api/Orders/${tableId}`).then(() => {
        fetchOrders();
        fetchStatistics();
      });
    },
    [fetchOrders, fetchStatistics]
  );

  return (
    <>
      <h1 className="ml-6 my-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalTables}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.totalEmployees}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Completed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.totalCompletedOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <AddOrderComponent fetchOrders={fetchOrders}></AddOrderComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Table Name</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead className="text-right">Update</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {orderData?.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.table.name}</TableCell>
                <TableCell>{order.item.name}</TableCell>
                <TableCell>{order.employee.name}</TableCell>
                <TableCell className="text-end">
                  {!order.isCompleted ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateOrder(order.orderId)}
                    >
                      <Check></Check>
                    </Button>
                  ) : (
                    <></>
                  )}
                </TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => ondeleteOrder(order.orderId)}
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

interface AddOrderComponentProps {
  fetchOrders: () => void;
}

export function AddOrderComponent(props: AddOrderComponentProps) {
  const formSchema = z.object({
    tableId: z.string({ required_error: "Table is required" }).min(1).max(25),
    itemId: z.string({ required_error: "Item is required" }).min(1).max(25),
    employeeId: z
      .string({ required_error: "Employee is required" })
      .min(1)
      .max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [employeeData, setEmployeeData] = useState<EmployeeState[]>();
  const [tableData, setTableData] = useState<TableState[]>();
  const [itemData, setItemData] = useState<ItemState[]>();

  useEffect(() => {
    axios.get(`${env.SERVER_URL}/api/Employees`).then((res) => {
      setEmployeeData(res.data);
    });

    axios.get(`${env.SERVER_URL}/api/Tables`).then((res) => {
      setTableData(res.data);
    });

    axios.get(`${env.SERVER_URL}/api/Items`).then((res) => {
      setItemData(res.data);
    });
  }, []);

  const onAddOrder = useCallback(async () => {
    const orderData = {
      tableId: form.getValues().tableId,
      itemId: form.getValues().itemId,
      employeeId: form.getValues().employeeId,
      isCompleted: false,
    };

    await axios.post(`${env.SERVER_URL}/api/Orders`, orderData);
    props.fetchOrders();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Order</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="tableId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Table</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Table" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tableData?.map((table) => (
                      <SelectItem
                        key={table.tableId}
                        value={table.tableId.toString()}
                      >
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {itemData?.map((item) => (
                      <SelectItem
                        key={item.itemId}
                        value={item.itemId.toString()}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employeeData?.map((employee) => (
                      <SelectItem
                        key={employee.employeeId}
                        value={employee.employeeId.toString()}
                      >
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={onAddOrder}>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
