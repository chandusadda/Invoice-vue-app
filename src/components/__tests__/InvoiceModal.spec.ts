import { describe, it, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import InvoiceModal from "../common/InvoiceModal.vue";
import { nextTick } from "vue";
import type { Address, InvoiceInterface } from "../common/InvoiceInterface";

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
  return mount(InvoiceModal, {
    data() {
      return props;
    },
  });
};

describe("InvoiceModal", () => {
  it("renders Invoice Modal component properly", () => {
    const wrapper = mount(InvoiceModal);
    expect(wrapper.find("invoice-header ")).toBeDefined();
  });

  it("should have Add Invoice button Invoice Modal component", () => {
    const wrapper = mount(InvoiceModal);
    expect(wrapper.findAll("add-invoice-btn")).toBeDefined();
  });

  //   it("should have heading defined in header component", async () => {
  //     render(InvoiceModal, {
  //       props: {id: "viewId"},
  //       slots: {default: "heading"}
  //     });
  //     const view = await screen.findAllByText("heading")
  //     expect(view.length).to.equal(1);
  //   });

  it("should update showModal in Invoice Modal", async () => {
    // const wrapper = mount(InvoiceModal);

    const wrapper: VueWrapper<any> = factory({
      props: { showModal: true, invoiceData: invoice },
    });
    await nextTick();
    //   console.log("wrap", wrapper.html())
    // await wrapper.findAll(".add-item-btn")[0].trigger("click");
    // console.log("wrap", wrapper.vm.randomIdGenerator())
    // const invoicesDiv: DOMWrapper<Element>[] = wrapper.findAll(".side-panel-bg");
    expect(wrapper.vm.showModal).toBe(true);
  });

  it("should get unique random id every time in Invoice Modal", async () => {
    const wrapper: VueWrapper<any> = factory({
      props: { showModal: true, invoiceData: invoice },
    });
    expect(wrapper.vm.randomIdGenerator()).not.toBe(
      wrapper.vm.randomIdGenerator()
    );
  });

  it("should check valid address checkAllFields in Invoice Modal", async () => {
    const wrapper: VueWrapper<any> = factory({
      props: { showModal: true, invoiceData: invoice },
    });
    const addressValid: boolean = wrapper.vm.checkAllFields(
      invoice.clientAddress
    );
    expect(addressValid).toBe(true);
  });

  it("should check invalid address checkAllFields in Invoice Modal", async () => {
    const wrapper: VueWrapper<any> = factory({
      props: { showModal: true, invoiceData: invoice },
    });
    const address: Address = {
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "",
      country: "United Kingdom",
    };
    const addressValid: boolean = wrapper.vm.checkAllFields(address);
    expect(addressValid).toBe(false);
  });

  it("should remove a row in items list in Invoice Modal", async () => {
    const wrapper: VueWrapper<any> = factory({
      props: { showModal: true, invoiceData: invoice },
    });
    wrapper.vm.addNewRow();
    await nextTick();
    wrapper.vm.removeRow();
    await nextTick();
    expect(wrapper.vm.invoiceData.items.length).toBe(1);
  });

  it("should not remove a row in items list if list has only 1 row in Invoice Modal", async () => {
    const wrapper: VueWrapper<any> = factory({
      props: { showModal: true, invoiceData: invoice },
    });
    wrapper.vm.removeRow();
    await nextTick();
    expect(wrapper.vm.invoiceData.items.length).toBe(1);
  });
});
