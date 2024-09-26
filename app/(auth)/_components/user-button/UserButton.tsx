"use client";

import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useGetUser } from "../../_services";
import UserDefaultImage from "@/shared/assets/images/user-default.png";
import styles from "./UserButton.module.css";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Avatar,
  AvatarImage,
  Loader,
} from "@/shared/components";

function UserButton(): JSX.Element {
  const { data, isLoading } = useGetUser();
  const { signOut } = useAuthActions();
  const router = useRouter();

  const onSignOut = async () => {
    await signOut();
    router.replace("/auth");
  };

  if (isLoading) return <Loader />;

  if (!data) return <></>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {data.image ? (
            <AvatarImage className={styles["user-avatar-bg"]} src={data.image} alt="user" />
          ) : (
            <NextImage
              className={styles["user-avatar-bg"]}
              width={40}
              height={40}
              src={UserDefaultImage}
              alt="default-user"
            />
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className={styles["user-menu-item"]} onClick={onSignOut}>
          <LogOut className={styles["user-menu-item__icon"]} />
          <p>Sign Out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default UserButton;
