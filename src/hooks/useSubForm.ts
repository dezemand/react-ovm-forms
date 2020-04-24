import {useMemo} from "react";
import {FormHook, FormHookType, Path, PathNodeType} from "../types";
import {useFormIO} from "./useFormIO";

export function useSubForm<Values = any, ParentValues = any, RootValues = any>(parent: FormHook<ParentValues, RootValues>, name: string): FormHook<Values, RootValues> {
  const path = useMemo<Path>(() => [...parent.path, [PathNodeType.OBJECT_KEY, name]], [parent.path, name]);
  const io = useFormIO(parent.root, path);

  return {
    type: FormHookType.OBJECT,
    path,
    root: parent.root,
    ...io
  };
}
