import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { bathrooms, type Bathroom } from "~/data/bathrooms";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default function Bathroom() {
  const bathroom = useLoaderData<Bathroom>();

  return (
    <main>
      <section>
        <div className="flex justify-center">
          <Card className="md:w-[70%] m-2">
            <CardHeader>
              <CardTitle>{bathroom.title}</CardTitle>
              <CardDescription>{bathroom.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{bathroom.short_content}</p>
              <p className="pt-4">{bathroom.long_content}</p>
            </CardContent>
            <CardFooter>
              <Link to="/bathrooms">
                <Button>Explore more Bathrooms</Button>
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
  const bathroom = bathrooms.find((bathroom) => bathroom.slug === slug);
  if (!bathroom) {
    throw new Response("Bathroom not found", { status: 404 });
  }
  return bathroom;
}
