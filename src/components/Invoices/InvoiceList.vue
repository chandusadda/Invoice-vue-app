<script lang="ts">
import router from "@/router";
import { format } from "date-fns";
import { defineComponent } from "vue";
import type { InvoiceInterface } from "../common/InvoiceInterface";

export default defineComponent({
  /**
   * props will hold the parent componet state variables that passed from parent to child
   */
  props: ["invoicesData", "invoicesLoading"],
  /**
   * methods will all components functions
   */
  methods: {
    /**
     * openInvoiceView will navigate to perticular route
     * @param invoice is the Invoice instance
     */
    openInvoiceView(invoice: InvoiceInterface): void {
      router.push({ path: `/invoice/${invoice.id}` });
    },
    /**
     * parseDate will parse date string to custom format
     * @param date is the date string to be custom formatted
     */
    parseDate(date: string): string {
      return date ? format(new Date(date), "dd MMM yyyy") : date;
    },
  },
});
</script>

<template>
  <div class="invoices-list">
    <div v-if="invoicesData?.length > 0" class="invoice-card-main-div">
      <div
        class="invoice-card-div"
        v-for="invoice of invoicesData"
        :key="invoice.id"
        @click="openInvoiceView(invoice)"
      >
        <div style="flex-grow: 1">
          #<span class="text-white fw-500">{{ invoice.id }}</span>
        </div>
        <div style="flex-grow: 1">Due {{ parseDate(invoice.paymentDue) }}</div>
        <div style="flex-grow: 1">{{ invoice.clientName }}</div>
        <div style="flex-grow: 1">
          <span class="text-white invoice-card-total"
            >&#x20AC;{{ invoice.total }}</span
          >
        </div>
        <div style="flex-grow: 1" class="text-center">
          <button
            type="button"
            class="invoice-status-btn rounded-md border text-sm font-medium leading-4 text-gray-700"
            :class="{
              'color-draft': invoice.status && invoice.status === 'draft',
              'color-paid': invoice.status && invoice.status === 'paid',
              'color-pending': invoice.status && invoice.status === 'pending',
            }"
          >
            <span class="invoice-status-btn-dot">.</span>
            {{ invoice.status }}
          </button>
          <img alt="icon right" src="@/assets/images/icon-arrow-right.svg" />
        </div>
      </div>
    </div>
    <div
      v-if="!invoicesLoading && invoicesData?.length === 0"
      class="no-invoices"
    >
      <img alt="invoices empty" src="@/assets/images/illustration-empty.svg" />
      <h3 data-testid="text">There is nothing here</h3>
      <p class="no-invoices-text1">Create an invoice by clicking the</p>
      <p class="no-invoices-text2">
        <span>New Invoice</span> button & get started
      </p>
    </div>
  </div>
</template>

<style scoped>
.invoices-list {
  display: flex;
  justify-content: center;
  height: 70vh;
}

.invoice-card-div .invoice-card-total {
  font-weight: 600;
  font-size: 1.2rem;
}

.invoice-card-div .invoice-status-btn {
  padding: 0.5rem 1.75rem;
  border: 0px;
}

.invoice-status-btn .invoice-status-btn-dot {
  font-weight: 700;
  font-size: 3rem;
  height: 10px;
  display: inline-block;
  margin-top: -11px;
}

.color-draft {
  background-color: #5454543d;
  color: var(--color-heading);
}

.color-paid {
  background-color: #00bd7e21;
  color: #00bd7e;
}

.color-pending {
  background-color: #e86b6b26;
  color: #e86b6b;
}

.invoice-card-div .invoice-status-btn + img {
  display: inline-block;
  margin-left: 2rem;
}

.invoices-list .invoice-card-main-div {
  width: 100%;
}

.invoices-list .invoice-card-div {
  width: 97%;
  display: flex;
  padding: 1rem;
  background-color: var(--color-background-sidebar);
  margin: 1rem;
  border-radius: 0.5rem;
}

.no-invoices {
  width: 25%;
  height: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.no-invoices img {
  width: 85%;
  height: 90%;
  margin-bottom: 3rem;
}
.no-invoices .no-invoices-text1 {
  padding-left: 0.5rem;
  font-size: 15px;
  margin-top: 1rem;
}
.no-invoices .no-invoices-text2 {
  font-size: 15px;
}
.no-invoices .no-invoices-text2 span {
  font-weight: 600;
  color: #f8f8f8c2;
}
</style>
