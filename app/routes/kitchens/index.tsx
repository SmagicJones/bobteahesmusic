import { Link } from "react-router";
import { kitchens, type Kitchen } from "~/data/kitchens";
import ContactForm from "~/components/ContactForm";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
export default function Kitchens() {
  const [showForm, setShowForm] = useState(false);
  return (
    <main>
      <header className="bg-purple-300 dark:bg-slate-900">
        <div className="grid md:grid-cols-2 gap-4 p-4">
          <div className="flex items-center ">
            <div>
              <h2 className="text-4xl">Your Kitchen ready for an uplift?</h2>
              <h3 className="pt-4 text-2xl">
                Get in touch with us and help us achieve your dreams
              </h3>
              <p className="pt-4">
                We are so keen to give you exactly what you were looking for -{" "}
                <br />
                if you can't quite decide - no problem - we will work with you
                to get a perfected design
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-[100%]">
            <ContactForm />
          </div>
        </div>
      </header>
      <section className="bg-purple-200 dark:bg-slate-800">
        <div className="p-4 flex justify-center items-center">
          <div>
            <h3 className="text-center text-2xl">Our Completed Kitchens</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 p-4 m-2">
          {kitchens.map((kitchen) => (
            <Card>
              <CardHeader>
                <CardTitle>{kitchen.title}</CardTitle>
                <CardDescription>{kitchen.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>{kitchen.short_content}</CardContent>
              <CardFooter>
                <Link to={`/kitchens/${kitchen.slug}`}>
                  <Button>Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
