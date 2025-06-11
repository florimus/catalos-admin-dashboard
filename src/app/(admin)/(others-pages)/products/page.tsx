"use server";

import { getProducts } from '@/actions/product';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableCard from '@/components/common/TableCard';
import ProductList from '@/components/products/ProductList';
import { IPage, IProduct, IResponse, ISearchParams } from '@/core/types';
import React from "react";


export default async function BasicTables(ctx: { searchParams?: Promise<ISearchParams | null> }) {

  const searchParams: ISearchParams | null = await ctx.searchParams || {};
  
  const response: IResponse<IPage<IProduct>> = await getProducts(searchParams?.query, searchParams?.page, searchParams?.size);

  if (!response.success) {
    console.error("Failed to fetch products:", response.message);
    return <div>Error fetching products: {response.message}</div>;
  }

  const cta = {
    label: "Add Product",
    href: "/products/create",
  }
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Products" />
      <div className="space-y-6">
        <TableCard searchPlaceHolder={"Search products..."} searchParams={searchParams} cta={cta}>
          <ProductList {...response.data}/>
        </TableCard>
      </div>
    </div>
  );
}
