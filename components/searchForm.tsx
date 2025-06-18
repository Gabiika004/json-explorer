"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

export type FormValues = {
  date?: string;
  agent?: string;
  customerEmail?: string;
  customerName?: string;
  ticketId?: string;
};

interface SearchFormProps {
  onSearch: (values?: FormValues) => void;
}

function formatDateForSearch(date?: unknown): string | undefined {
  if (date instanceof Date) {
    return format(date, "yyyy-MM-dd");
  }
  return undefined;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const rhf = useForm<FormValues>({
    defaultValues: {
      date: undefined,
      agent: "",
      customerEmail: "",
      customerName: "",
      ticketId: "",
    },
  });

  const { watch, reset } = rhf;
  const watchAgent = watch("agent");
  const watchDate = rhf.watch("date");
  const watchCustomerEmail = rhf.watch("customerEmail");
  const watchCustomerName = rhf.watch("customerName");
  const watchTicketId = rhf.watch("ticketId");

  useEffect(() => {
    const currentDate = watchDate as Date | undefined;

    onSearch({
      agent: watchAgent || undefined,
      date: formatDateForSearch(currentDate),
      customerEmail: watchCustomerEmail || undefined,
      ticketId: watchTicketId || undefined,
      customerName: watchCustomerName || undefined,
    });
  }, [
    watchAgent,
    watchDate,
    watchCustomerEmail,
    watchTicketId,
    watchCustomerName,
  ]);

  const handleReset = () => {
    reset({
      date: undefined,
      agent: "",
      customerEmail: "",
      customerName: "",
      ticketId: "",
    });
    onSearch();
  };

  return (
    <Form {...rhf}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-wrap items-start gap-4 mb-6 bg-white/10 p-6 max-w-5xl mx-auto rounded-xl shadow-md backdrop-blur border border-white/20 text-white"
      >
        <FormField
          control={rhf.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full md:w-auto">
              <FormLabel>Dátum</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full md:w-[240px] pl-3 pr-2 text-left font-normal text-gray-800 bg-white",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy-MM-dd")
                      ) : (
                        <span>Válassz dátumot</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-[#0D0D0D] border rounded-md shadow text-white"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={
                      typeof field.value === "string" &&
                      !isNaN(Date.parse(field.value))
                        ? new Date(field.value)
                        : undefined
                    }
                    onSelect={(date) => {
                      field.onChange(date);
                      if (date instanceof Date) {
                        onSearch({
                          agent: rhf.getValues("agent") || undefined,
                          date: formatDateForSearch(date),
                        });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={rhf.control}
          name="agent"
          render={({ field }) => (
            <FormItem className="w-full md:w-auto">
              <FormLabel>Agent email</FormLabel>
              <FormControl>
                <Input
                  placeholder="pl: vegasonline"
                  {...field}
                  className="bg-white text-gray-800 min-w-50"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={rhf.control}
          name="customerEmail"
          render={({ field }) => (
            <FormItem className="w-full md:w-auto">
              <FormLabel>Ügyfél email</FormLabel>
              <FormControl>
                <Input
                  placeholder="pl: gmail.com"
                  {...field}
                  className="bg-white text-gray-800 min-w-50"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={rhf.control}
          name="customerName"
          render={({ field }) => (
            <FormItem className="w-full md:w-auto">
              <FormLabel>Ügyfél név</FormLabel>
              <FormControl>
                <Input
                  placeholder="pl: Béla"
                  {...field}
                  className="bg-white text-gray-800 min-w-50"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={rhf.control}
          name="ticketId"
          render={({ field }) => (
            <FormItem className="w-full md:w-auto">
              <FormLabel>Ticket ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="pl: 123abc"
                  {...field}
                  className="bg-white text-gray-800 min-w-50"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            type="button"
            className="w-full cursor-pointer md:w-auto bg-[#00FF85] hover:bg-[#33cc82] text-black font-bold px-4 py-2 transition hover:scale-105"
            onClick={handleReset}
          >
            Szűrők törlése
          </Button>
        </div>
      </form>
    </Form>
  );
}
