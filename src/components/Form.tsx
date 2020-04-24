import React, {ReactNode, useCallback} from "react";
import {FormContext} from "../contexts/FormContext";
import {DO_SUBMIT_EVENT} from "../events";
import {useEventListener} from "../hooks/useEventListener";
import {ErrorObject, FormHook} from "../types";

export interface FormProps<Values> {
  form: FormHook;
  onSubmit?: (values: Values) => Promise<void> | void;
  onError?: (errors: ErrorObject, values: Values) => Promise<void> | void;
  noFormTag?: boolean;
  children?: ReactNode;
}

export function Form<Values = any>({children, form, onSubmit, onError, noFormTag}: FormProps<Values>) {
  const {root: {submitting, setSubmitting, getValues, getValidationResult, target}} = form;

  const submit = useCallback(async () => {
    if (submitting) return;

    setSubmitting(true);
    const values = getValues();
    const [errored, validateResult] = await getValidationResult(values);

    if (errored && onError) await onError(validateResult, values);
    if (!errored && onSubmit) await onSubmit(values);

    setSubmitting(false);
  }, [getValidationResult, getValues, onError, onSubmit, setSubmitting, submitting]);

  const formSubmit = useCallback(async event => {
    event.preventDefault();
    await submit();
  }, [submit]);

  useEventListener(target, DO_SUBMIT_EVENT, submit);

  return (
    <FormContext.Provider value={form}>
      {noFormTag ? (
        children
      ) : (
        <form onSubmit={formSubmit}>
          {children}
        </form>
      )}
    </FormContext.Provider>
  );
}
