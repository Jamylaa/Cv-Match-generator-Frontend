import React from 'react';
import MuiGrid from '@mui/material/Grid';
import { GridProps as MuiGridProps } from '@mui/material/Grid';
import { SxProps, Theme } from '@mui/material/styles';

interface GridProps extends MuiGridProps {
  item?: boolean;
  container?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  spacing?: number;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const Grid: React.FC<GridProps> = (props) => {
  return <MuiGrid {...props} />;
};

export default Grid;