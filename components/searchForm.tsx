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
  email?: string; // Új közös mező
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
      email: "",
      customerName: "",
      ticketId: "",
    },
  });

  const { watch, reset } = rhf;
  const watchEmail = watch("email");
  const watchDate = rhf.watch("date");
  const watchCustomerName = rhf.watch("customerName");
  const watchTicketId = rhf.watch("ticketId");

  useEffect(() => {
    const currentDate = watchDate as Date | undefined;

    onSearch({
      email: watchEmail || undefined,
      date: formatDateForSearch(currentDate),
      ticketId: watchTicketId || undefined,
      customerName: watchCustomerName || undefined,
    });
  }, [watchEmail, watchDate, watchTicketId, watchCustomerName]);

  const handleReset = () => {
    reset({
      date: undefined,
      email: "",
      customerName: "",
      ticketId: "",
    });
    onSearch();
  };

  return (
    <Form {...rhf}>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#888888] dark:bg-[#222] border-b border-border shadow-lg px-4 py-6 flex flex-col items-center">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-wrap items-center gap-4 w-full max-w-5xl justify-center"
        >
          {/* Dátum mező */}
          <FormField
            control={rhf.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full md:w-auto">
                <FormLabel className="text-foreground">Dátum</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full md:w-[140px] pl-3 pr-2 text-left font-normal text-foreground bg-background border border-border",
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
                    className="w-auto p-0 bg-background border border-border rounded-md shadow text-foreground"
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

          {/* Közös email mező */}
          <FormField
            control={rhf.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-foreground">
                  Email (agent vagy ügyfél)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="pl: vegasonline vagy gmail.com"
                    {...field}
                    className="bg-background text-foreground border border-border min-w-32"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Ügyfél név */}
          <FormField
            control={rhf.control}
            name="customerName"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-foreground">Ügyfél név</FormLabel>
                <FormControl>
                  <Input
                    placeholder="pl: Béla"
                    {...field}
                    className="bg-background text-foreground border border-border min-w-32"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Ticket ID */}
          <FormField
            control={rhf.control}
            name="ticketId"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-foreground">Ticket ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="pl: 123abc"
                    {...field}
                    className="bg-background text-foreground border border-border min-w-32"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row gap-4  w-full md:w-auto mt-6 md:mt-0">
            <Button
              type="button"
              className="w-full cursor-pointer md:w-auto bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-4 py-2 transition hover:scale-102"
              onClick={handleReset}
            >
              Szűrők törlése
            </Button>
            <Button
              type="button"
              className="w-full cursor-pointer md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 transition hover:scale-102"
              onClick={async () => {
                await fetch("/api/reload", { method: "POST" });
                window.location.reload();
              }}
            >
              Adatok beolvasása
            </Button>
          </div>
        </form>
      </nav>
    </Form>
  );
}
