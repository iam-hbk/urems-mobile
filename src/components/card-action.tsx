import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  action: string;
  description: string;
  route: string;
};

const CardAction = (props: Props) => {
  return (
    <>
      <Card className="hidden h-full lg:block">
        <CardContent className="max-w-xs">{props.description}</CardContent>
        <CardFooter className="flex flex-row justify-end">
          <Button className="w-20" asChild>
            <Link href={props.route}>{props.action}</Link>
          </Button>
        </CardFooter>
      </Card>
      <Button className="w-full lg:hidden" asChild>
        <Link href={props.route}>{props.action}</Link>
      </Button>
    </>
  );
};

export default CardAction;
