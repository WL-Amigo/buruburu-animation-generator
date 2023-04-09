import { Component } from 'solid-js';
import classes from './fulfilling-square-spinner.module.css';
import clsx from 'clsx';

export const SquareSpinner: Component<{ class?: string }> = (props) => (
  <div class={clsx(classes['fulfilling-square-spinner'], props.class)}>
    <div class={classes['spinner-inner']} />
  </div>
);
