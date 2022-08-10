import ListItem from "./ListItem";

export default function List({ items, SLOT_ID, tag }) {
  return items.map((item, index) => {
    if (index == 0 || index == 2) {
      return <ListItem key={item.id} item={item} SLOT_ID={SLOT_ID} tag={tag} />;
    }
    return <ListItem key={item.id} item={item} />;
  });
}
