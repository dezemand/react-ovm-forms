import React, {ComponentClass, createElement, FC, FunctionComponent, ReactNode} from "react";
import {useFormContext, useInputValue} from "..";
import {Path} from "../store/Path";
import {ArrayFormItem} from "./ArrayFormItem";

export interface ArrayFormItemsChildrenParams<Values> {
  values: Values;
  index: number;

  remove(): void;
}

interface ArrayFormItemsProps<ParentValues extends Array<ParentValues>> {
  component?: FunctionComponent<ArrayFormItemsChildrenParams<ParentValues[0]>> | ComponentClass<ArrayFormItemsChildrenParams<ParentValues[0]>> | string;

  children?(options: ArrayFormItemsChildrenParams<ParentValues[0]>): ReactNode;

  getKey?(values: ParentValues[0], index: number): any;
}

function defaultGetKey(_: unknown, index: number): any {
  return `ArrayFormItems(${index})`;
}

export function ArrayFormItems<ParentValues extends Array<ParentValues> = any[], RootValues = any>({children, component, getKey}: ArrayFormItemsProps<ParentValues>): ReturnType<FC<ArrayFormItemsProps<ParentValues>>> {
  const form = useFormContext();
  const items = useInputValue([Path.ROOT]);

  const removeItem = (index: number) => {
    form.modify<any[]>(arr => (arr || []).filter((_, i) => i !== index));
  };

  const getItemElement = (values: ParentValues[0], index: number) => (
    children ? (
      children({values, index, remove: () => removeItem(index)} as ArrayFormItemsChildrenParams<ParentValues[0]>)
    ) : (component ? (
      createElement(component, {
        values,
        index,
        remove: () => removeItem(index)
      } as ArrayFormItemsChildrenParams<ParentValues[0]>)
    ) : null)
  );

  return (
    <>
      {(items || []).map((values: ParentValues[0], index) => (
        <ArrayFormItem index={index} key={(getKey || defaultGetKey)(values, index)}>
          {getItemElement(values, index)}
        </ArrayFormItem>
      ))}
    </>
  );
}
