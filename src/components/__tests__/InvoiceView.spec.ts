import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/vue"
import { DOMWrapper, mount, shallowMount, VueWrapper } from "@vue/test-utils";
import InvoiceView from "../Invoices/Invoice-view/InvoiceView.vue";
import { nextTick } from "vue";

const factory = ({ data }: any = { data: {} }): VueWrapper<any> => {
    return  shallowMount(InvoiceView, {
      data() {
        return data;
      },
    });
  };

describe("InvoiceView", () => {
  it("renders Invoice component properly", () => {
    const wrapper = shallowMount((InvoiceView));
    expect(wrapper.find("invoice-header ")).toBeDefined();
  });

  it("should have Add Invoice button Invoice component", () => {
    const wrapper = mount(InvoiceView);
    expect(wrapper.findAll("add-invoice-btn")).toBeDefined();
  });


// it("should open edit form on click of edit button in Invoice component", async () => {
//     // const wrapper = mount(InvoiceView);

//     const wrapper: VueWrapper<any> = factory({
//         data: { showModal: false, showDeleteModal: false },
//       });
//     await wrapper.findAll(".invoice-status-btn")[0].trigger("click");
//     await nextTick();
//     // const invoicesDiv: DOMWrapper<Element>[] = wrapper.findAll(".side-panel-bg");
//     expect(wrapper.vm.showModal).toBe(true);
//   });

//   it("should open delete modal on click of delete button in Invoice component", async () => {
//     // const wrapper = mount(InvoiceView);

//     const wrapper: VueWrapper<any> = factory({
//         data: { showModal: false, showDeleteModal: true },
//         watch: {
//             testData() {
//               // @ts-ignore
//               dataWatchSpy(this.$el)
//             }
//           },
//       });
//     await wrapper.find(".delete-invoice-btn").trigger("click");
//     await nextTick();
//     wrapper.vm.hideDeleteModal();
//     // const invoicesDiv: DOMWrapper<Element>[] = wrapper.findAll(".delete-modal-main-div ");
//     expect(wrapper.vm.showDeleteModal).toBe(true);
//   });

});
