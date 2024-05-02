import Peoples from '@/components/shared/Peoples';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { useUserContext } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { multiFormatDateString } from '@/lib/utils';
import { io } from 'socket.io-client';

type Notification = {
  id: number;
  type: string;
  postId: number;
  content: string;
  userId: number;
  createdAt: string;
};
const server = process.env.REACT_APP_BACKEND_PORT || 'http://localhost:8000'
const socket = io(`${server}`);

const Notifications = () => {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Emit event to fetch notifications when the component mounts
    socket.emit('fetchNotifications', { userId: user.id });

    // Listen for initial notifications when the component mounts
    socket.on('initialNotifications', (initialNotifications) => {
      console.log(initialNotifications);
      setNotifications(initialNotifications);
    });

    // Listen for new notifications
    socket.on('newNotifs', (data) => {
      console.log('New Notifs', data);
      console.log('Received notification');
      // Assuming data received from the server has the same structure as Notification type
      const newNotification: Notification = {
        id: data.id,
        type: data.type,
        postId: data.postId,
        content: data.content,
        userId: data.postAuthorId,
        createdAt: data.createdAt,
      };

      // Update state by adding the new notification
      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    });

    // Clean up by disconnecting socket when the component unmounts
    // return () => {
    //   socket.disconnect();
    // };
  }, [user.id]); // Include user.id in the dependency array

  return (
    <div className="flex flex-1 overflow-y-scroll custom-scrollbar">
      <div className="explore-container gap-5">
        <span className="text-xl font-bold">Notifications</span>
        <div className="w-full">
          <Table>
            <TableCaption>No more notifications. </TableCaption>
            <TableBody>
              {notifications.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="hover:bg-blue-200 ease-in-out transition duration-300"
                >
                  <TableCell className="font-medium rounded-lg ">
                    <a className='flex flex-between'
                      href={
                        invoice.type === 'like'
                          ? `http://localhost:5173/posts/${invoice.postId}`
                          : invoice.type === 'likeShared'
                          ? `http://localhost:5173/shared-post/${invoice.postId}`
                          : `http://localhost:5173/posts/`
                      }
                    >
                      <span>{invoice.content}</span>{' '}
                      <span>{multiFormatDateString(invoice.createdAt)}</span>
                    </a>
                  </TableCell>
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
