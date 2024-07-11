import React from 'react';
import { Skeleton } from '@mui/material';
import { Box, Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';

const TableSkeleton = () => {
    return (
        <Box width="100%" overflow="hidden">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Skeleton variant="rectangular" width={210} height={30} /></TableCell>
                        <TableCell><Skeleton variant="text" width={100} height={30} /></TableCell>
                        <TableCell><Skeleton variant="text" width={100} height={30} /></TableCell>
                        <TableCell><Skeleton variant="text" width={100} height={30} /></TableCell>
                        <TableCell><Skeleton variant="text" width={100} height={30} /></TableCell>
                        <TableCell><Skeleton variant="text" width={100} height={30} /></TableCell>
                        <TableCell><Skeleton variant="text" width={50} height={30} /></TableCell>
                        <TableCell><Skeleton variant="text" width={50} height={30} /></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from(new Array(5)).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton variant="rectangular" width={100} height={100} /></TableCell>
                            <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                            <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                            <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                            <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                            <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                            <TableCell><Skeleton variant="text" width={50} height={20} /></TableCell>
                            <TableCell>
                                <Skeleton variant="circular" width={40} height={40} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default TableSkeleton;
