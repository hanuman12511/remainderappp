import {createAsyncThunk} from '@reduxjs/toolkit';
import SellerRepo from '../../repo/SellerRepo';

export const getSellerScheduledShowListThnuk = createAsyncThunk(
  'getSellerScheduledShowListThnuk',
  async (body: any) => {
    const res = await SellerRepo.GetSellerScheduledShowListApi(
      body.pageNumber,
      body.pageSize,
    );
    return res;
  },
);

export const getSellerScheduledShowListLoadMoreThnuk = createAsyncThunk(
  'getSellerScheduledShowListLoadMoreThnuk',
  async (body: any) => {
    const res = await SellerRepo.GetSellerScheduledShowListApi(
      body.pageNumber,
      body.pageSize,
    );
    return res;
  },
);

export const getSellerScheduledShowSearch = createAsyncThunk(
  'getSellerScheduledShowSearch',
  async (body: any) => {
    const res = await SellerRepo.GetSellerScheduledShow(
      body.pageNumber,
      body.pageSize,
      body.search,
    );
    return res;
  },
);
