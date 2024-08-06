import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  action: string;
  description: string;
  route: string;
};

const CardAction = (props: Props) => {
  return (
    <Card>
      <CardContent className="max-w-xs">{props.description}</CardContent>
      <CardFooter className="flex flex-row justify-end">
        <Button className="w-20" asChild>
          <Link href={props.route}>{props.action}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardAction;
