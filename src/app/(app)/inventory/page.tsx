import { PlaceholderPage } from "@/components/placeholder-page";

export default function InventoryPage() {
  return (
    <PlaceholderPage
      title="Inventory"
      description="Reserve this route for on-hand stock, backroom counts, in-transit inventory, and future inventory alerts."
      checkpoints={[
        "Add inventory table and store filters.",
        "Connect inventory API queries and loading states.",
        "Surface low-stock and restock recommendation cards.",
      ]}
    />
  );
}
