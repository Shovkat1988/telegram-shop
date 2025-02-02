import React from "react";
import { Button, Card, ContentCard, SimpleCell } from "@vkontakte/vkui";
import declOfNum from "../../../modules/declOfNum";

const CategoryCard = ({
  products_count,
  title,
  id,
  action = () => {},
  deleteAction = null,
}) => {
  return (
    <Card className={"mb10"}>
      <SimpleCell
        expandable
        hasHover={false}
        hasActive={false}
        mode={"outline"}
        onClick={() => action(id)}
        description={
          declOfNum(products_count, ["товар", "товара", "товаров"]) +
          " в категории"
        }
      >
        {title}
      </SimpleCell>

      {deleteAction ? (
        <Button
          stretched
          size={"m"}
          className={"mt10"}
          mode={"secondary"}
          onClick={() => deleteAction(id)}
        >
          Удалить
        </Button>
      ) : (
        ""
      )}
    </Card>
  );
};

export default CategoryCard;
