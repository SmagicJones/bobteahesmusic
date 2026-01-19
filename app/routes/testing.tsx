import { kitchens, type Kitchen } from "~/data/kitchens";

export default function Testing() {
  return (
    <main>
      <header className="bg-slate-300 rounded m-2 p-4">
        <h1 className="text-center text-2xl">Testing</h1>
      </header>
      <section>
        <div className="grid md:grid-cols-2 gap-2 m-2">
          {kitchens.map((kitchen) => (
            <div>{kitchen.title}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
