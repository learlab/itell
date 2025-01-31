import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { type User } from "lucia";

interface Props extends React.ComponentPropsWithoutRef<typeof Avatar> {
  user: User;
  className?: string;
  alt?: string;
}

export function UserAvatar({ user, className, alt, ...rest }: Props) {
  return (
    <Avatar className={className} {...rest}>
      {user.image ? (
        <>
          <AvatarImage src={user.image} alt={alt ?? "User profile photo"} />
          <AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback>
        </>
      ) : (
        <AvatarFallback>U</AvatarFallback>
      )}
    </Avatar>
  );
}
