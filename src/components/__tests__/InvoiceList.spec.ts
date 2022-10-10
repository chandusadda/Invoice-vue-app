import { describe, it, expect } from "vitest";
import { DOMWrapper, mount, VueWrapper } from "@vue/test-utils";
import InvoiceList from "../Invoices/InvoiceList.vue";
import { format } from "date-fns";
import type { InvoiceInterface } from "../common/InvoiceInterface";

const invoice: InvoiceInterface = {
  id: "RT3080",
  createdAt: "2021-08-18",
  paymentDue: "2021-08-19",
  description: "Re-branding",
  paymentTerms: 1,
  clientName: "Jensen Huang",
  clientEmail: "jensenh@mail.com",
  status: "paid",
  senderAddress: {
    street: "19 Union Terrace",
    city: "London",
    postCode: "E1 3EZ",
    country: "United Kingdom",
  },
  clientAddress: {
    street: "106 Kendell Street",
    city: "Sharrington",
    postCode: "NR24 5WQ",
    country: "United Kingdom",
  },
  items: [
    {
      name: "Brand Guidelines",
      quantity: 1,
      price: 1800.9,
      total: 1800.9,
    },
  ],
  total: 1800.9,
};

const factory = ({ props }: any = { props: {} }): VueWrapper<any> => {
  return mount(InvoiceList, {
    data() {
      return props;
    },
  });
};

describe("InvoiceList", () => {
  it("renders invoices list component properly", () => {
    const wrapper: VueWrapper<any> = mount(InvoiceList);
    expect(wrapper.find("invoices-list")).toBeDefined();
  });

  it("should invoiceLoading have default value in list component", async () => {
    const wrapper: VueWrapper<any> = factory({
      props: { invoicesData: [], invoicesLoading: false },
    });
    expect(wrapper.vm.invoicesLoading).toBe(false);
  });

  it("should hide Invoices container if invoicesData is empty & invoicesLoading is false in list component", () => {
    const wrapper: VueWrapper<any> = factory({
      props: { invoicesData: [], invoicesLoading: false },
    });
    const invoicesDiv:  DOMWrapper<Element>[] = wrapper.findAll(".invoice-card-main-div");
    expect(invoicesDiv.length).toBe(0);
  });

  it("should show Invoices container if invoicesData have data & invoicesLoading is true in list component", () => {
    const wrapper: VueWrapper<any> = factory({
      props: { invoicesData: [invoice], invoicesLoading: true },
    });
    expect(wrapper.find(".invoice-card-main-div").isVisible());
  });

  it("should invoiceLoading have default value in list component", async () => {
    const wrapper: VueWrapper<any> = factory({
      props: { invoicesData: [invoice], invoicesLoading: true },
    });
    const expectedTime: string = format(new Date(), "dd MMM yyyy");
    expect(wrapper.vm.parseDate(new Date().toISOString())).toBe(expectedTime);
  });

});
