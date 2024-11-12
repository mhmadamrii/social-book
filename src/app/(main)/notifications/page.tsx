import { api } from "~/trpc/server";

export default async function Notifications() {
  const user = await api.auth.getAllUsers();
  return (
    <section>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt at
        atque architecto, in, possimus maxime quia, magnam nostrum quas quae
        dolore rem facere saepe voluptates expedita soluta ipsa voluptatem
        reiciendis.
      </p>
    </section>
  );
}
