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
  console.log(bathroom);
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
        {/* <div className="grid grid-cols-1 m-2 gap-4">
          <div className="bg-slate-400 rounded p-4">
            <h2>{bathroom.subtitle}</h2>
            <p>{bathroom.short_content}</p>
          </div>
          <div className="bg-slate-400 rounded p-4">
            <p>{bathroom.long_content}</p>
          </div>
          <div className="bg-slate-400 rounded p-4">
            <h3 className="text-xl mb-2">Features</h3>
            <ul className="list-disc list-inside">
              {bathroom.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-400 rounded p-4">
            <p>
              <strong>Completed:</strong> {bathroom.completionDate}
            </p>
            <p>
              <strong>Location:</strong> {bathroom.location}
            </p>
          </div>
        </div> */}
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
