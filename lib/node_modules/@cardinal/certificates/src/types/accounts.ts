import { IdlTypes, web3 } from "@project-serum/anchor";
import { TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { CardinalCertificate } from "./idl";

export type AccountData<T> = {
  pubkey: web3.PublicKey;
  parsed: T;
};

export type CertificateData = TypeDef<
  CardinalCertificate["accounts"][0],
  IdlTypes<CardinalCertificate>
>;

export type MintManagerData = TypeDef<
  CardinalCertificate["accounts"][1],
  IdlTypes<CardinalCertificate>
>;
