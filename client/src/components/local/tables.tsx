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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../config";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "../ui/card";

export interface TableState {
  tableId: number;
  name: string;
}

export default function Tables() {
  const [tableData, setTableData] = useState<TableState[]>();

  const fetchTables = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Tables`).then((res) => {
      setTableData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const ondeleteTable = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Tables/${tableId}`).then(() => {
        fetchTables();
      });
    },
    [fetchTables]
  );

  return (
    <>
      <h1 className="ml-6 my-6 text-2xl font-bold">Tables</h1>

      <div className="mb-6">
        <AddTableComponent fetchTables={fetchTables}></AddTableComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {tableData?.map((table) => (
              <TableRow key={table.tableId}>
                <TableCell>{table.tableId}</TableCell>
                <TableCell>{table.name}</TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => ondeleteTable(table.tableId)}
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

interface AddTableComponentProps {
  fetchTables: () => void;
}

export function AddTableComponent(props: AddTableComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onAddTable = useCallback(async () => {
    const tableData = {
      name: form.getValues().name,
    };

    await axios.post(`${env.SERVER_URL}/api/Tables`, tableData);
    form.reset();
    form.setValue("name", "");
    props.fetchTables();
  }, [form, props]);

  return (
    <Card>
      <CardContent className="bg-gray-400 flex space-x-4 py-4">
        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-auto">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        <Button
          type="button"
          className="mt-auto"
          disabled={!form.formState.isValid}
          onClick={onAddTable}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
