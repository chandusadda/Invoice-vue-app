<script lang="ts">
import InvoiceHeader from "./InvoiceHeader.vue";
import InvoiceList from "./InvoiceList.vue";
import axios from "axios";
import { defineComponent } from "vue";
import ModalView from "../common/InvoiceModal.vue";
import type { InvoivesCompProps } from "../common/InvoiceInterface";

export default defineComponent({
  /**
   * components will hold the child components decorators
   */
  components: {
    InvoiceList,
    InvoiceHeader,
    ModalView,
  },
  /**
   * data will hold the complete componet state
   */
  data: (): InvoivesCompProps => {
    return {
      invoicesLoading: false,
      invoicesData: [],
      invoicesTotalText: "No invoices",
      showModal: false,
    };
  },
  /**
   * fetch the data when the view is created and the data is already being observed
   */
  created() {
    this.invoicesLoading = true;
    this.fetchInvoices();
  },
  /**
   * methods will all components functions
   */
  methods: {
    /**
     * fetchInvoices will get the complete list of Invoice from an API
     */
    async fetchInvoices(): Promise<void> {
      try {
        const res = await axios.get(`http://localhost:3000/invoices`);
        this.invoicesData = res.data;
        this.invoicesLoading = false;
        this.invoicesTotalText = res?.data?.length
          ? `There are ${res.data.length} total invoices`
          : this.invoicesTotalText;
      } catch (error) {
        this.invoicesLoading = false;
        console.error(error);
      }
    },
    /**
     * showAddModal will open the create Invoice modal
     */
    showAddModal() {
      this.showModal = true;
    },
    /**
     * hideAddModal will hide the create Invoice modal
     */
    hideAddModal() {
      this.showModal = false;
    },
  },
});
</script>

<template>
  <div class="invoices-main-div">
    <InvoiceHeader @showModal="showAddModal">
      <template #heading>Invoices</template>
      {{ invoicesTotalText }}
    </InvoiceHeader>
    <InvoiceList
      v-bind:invoicesData="invoicesData"
      v-bind:invoicesLoading="invoicesLoading"
    >
    </InvoiceList>
    <div v-if="showModal">
      <ModalView
        :showModal="showModal"
        @hideAddModal="hideAddModal"
        @fetchInvoices="fetchInvoices"
      ></ModalView>
    </div>
  </div>
</template>

<style scoped>
.invoices-main-div {
  margin-top: 2rem;
}
@media (min-width: 1024px) {
  .invoices-main-div {
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }
}
</style>
