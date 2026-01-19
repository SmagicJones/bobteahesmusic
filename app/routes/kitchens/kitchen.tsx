import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { kitchens, type Kitchen } from "~/data/kitchens";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

import { Button } from "~/components/ui/button";

export default function Kitchen() {
  const kitchen = useLoaderData();
  console.log(kitchen);
  return (
    <main>
      <header className="rounded p-4 flex justify-center items-center">
        <div className="text-center">
          <Link to="/kitchens">Back to Kitchens</Link>
        </div>
      </header>
      <section>
        <div className="flex justify-center">
          <Card className="md:w-[70%] m-2">
            <CardHeader>
              <CardTitle>{kitchen.title}</CardTitle>
              <CardDescription>{kitchen.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{kitchen.short_content}</p>
              <p className="pt-4">{kitchen.long_content}</p>
            </CardContent>
            <CardFooter>
              <Link to="/kitchens">
                <Button>Explore more Kitchens</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  const kitchen = kitchens.find((kitchen) => kitchen.slug === slug);
  if (!kitchen) {
    throw new Response("Kitchen not found", { status: 404 });
  }
  return kitchen;
}
