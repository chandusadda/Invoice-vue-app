import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/vue"
import { mount } from "@vue/test-utils";
import InvoicesHeader from "../Invoices/InvoiceHeader.vue";

describe("InvoiceHeader", () => {
  it("renders header component properly", () => {
    const wrapper = mount(InvoicesHeader);
    expect(wrapper.find("invoice-header ")).toBeDefined();
  });

  it("should have Add Invoice button header component", () => {
    const wrapper = mount(InvoicesHeader);
    expect(wrapper.findAll("add-invoice-btn")).toBeDefined();
  });

  it("should have heading defined in header component", async () => {
    render(InvoicesHeader, {
      props: {id: "viewId"},
      slots: {default: "heading"}
    });
    const view = await screen.findAllByText("heading")
    expect(view.length).to.equal(1);
  });
});
