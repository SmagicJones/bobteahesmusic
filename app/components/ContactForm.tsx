import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { forwardRef } from "react";

interface ContactFormProps {
  actionData?: {
    success: boolean;
    status?: number;
    error?: any;
    data?: any;
  };
}

const ContactForm = forwardRef<HTMLFormElement, ContactFormProps>(
  ({ actionData }, ref) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Book a Consultation</CardTitle>
          <CardDescription>
            Get the new look sooner than you think
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" action="/contact" ref={ref}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="firstname">First Name:</Label>
                <Input type="text" id="firstname" name="firstname" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name:</Label>
                <Input type="text" id="lastname" name="lastname" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email:</Label>
                <Input type="email" id="email" name="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message:</Label>
                <Textarea name="message" id="message"></Textarea>
              </div>
            </div>

            <Button type="submit" className="mt-2">
              Submit
            </Button>
          </Form>

          {/* Show messages from the action */}
          {actionData?.success && (
            <p className="mt-4 text-green-600">Thanks! Form submitted.</p>
          )}
          {actionData && actionData.success === false && (
            <p className="mt-4 text-red-600">
              Sorry, there was a problem:
              {actionData.error?.message || "Unknown error"}
            </p>
          )}
        </CardContent>
      </Card>
    );
  },
);

ContactForm.displayName = "ContactForm";

export default ContactForm;
