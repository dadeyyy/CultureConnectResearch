import Peoples from "@/components/shared/Peoples";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/ui/table";

const Notifications = () => {
  const invoices = [
    {
      notification: "Regee commented: I love you",
    },
    {
      notification: "Regee liked your post.",
    },
    {
      notification: "The post   you reported is currently pending",
    },
  ];

  return (
    <div className="flex flex-1 overflow-y-scroll custom-scrollbar">
      <div className="explore-container gap-5">
        <span className="text-xl font-bold">Notifications</span>
        <div className="w-full">
          <Table>
            <TableCaption>No more notifications. </TableCaption>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.notification}
                  className="hover:bg-blue-200 ease-in-out transition duration-300"
                >
                  <TableCell className="font-medium rounded-lg">{invoice.notification}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="home-creators custom-scrollbar overflow-x-auto gap-2">
        <Peoples />
      </div>
    </div>
  );
};

export default Notifications;
