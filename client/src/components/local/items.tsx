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

export interface ItemState {
  itemId: number;
  name: string;
  recipe: string;
  price: string;
}

export default function Items() {
  const [itemData, setItemData] = useState<ItemState[]>();

  const fetchItems = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Items`).then((res) => {
      setItemData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const ondeleteItem = useCallback(
    (itemId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Items/${itemId}`).then(() => {
        fetchItems();
      });
    },
    [fetchItems]
  );

  return (
    <>
      <h1 className="ml-6 my-6 text-2xl font-bold">Items</h1>

      <div className="mb-6">
        <AddItemComponent fetchItems={fetchItems}></AddItemComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Recipe</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {itemData?.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell>{item.itemId}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.recipe}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => ondeleteItem(item.itemId)}
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

interface AddItemComponentProps {
  fetchItems: () => void;
}

export function AddItemComponent(props: AddItemComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
    recipe: z.string({ required_error: "Recipe is required" }).min(1).max(25),
    price: z.string({ required_error: "Price is required" }).min(1).max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onAddItem = useCallback(async () => {
    const itemData = {
      name: form.getValues().name,
      recipe: form.getValues().recipe,
      price: form.getValues().price,
    };

    await axios.post(`${env.SERVER_URL}/api/Items`, itemData);
    form.reset();
    form.setValue("name", "");
    form.setValue("recipe", "");
    form.setValue("price", "");
    props.fetchItems();
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

          <FormField
            control={form.control}
            name="recipe"
            render={({ field }) => (
              <FormItem className="flex-auto">
                <FormLabel>Recipe</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Recipe" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-auto">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Price" type="text" {...field} />
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
          onClick={onAddItem}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
