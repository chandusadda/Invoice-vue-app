<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  /**
   * emits will hold all the parent methods that can be emmited from child
   */
  emits: ["showModal"],
  methods: {
    /**
     * showAddModal will access parent property showModal & toggles the modal
     */
    showAddModal(): void {
      this.$emit("showModal");
    },
  },
});
</script>

<template>
  <div class="invoice-header mt-5">
    <div class="details" style="flex-grow: 2">
      <h1>
        <slot name="heading"></slot>
      </h1>
      <slot></slot>
    </div>
    <div style="flex-grow: 4"></div>
    <div class="" style="flex-grow: 1">
      <select
        name="filter-invoice"
        class="filter-invoice mt-3 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Filter by status</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="draft">Draft</option>
      </select>
      <button
        type="button"
        class="add-invoice-btn mt-3 ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        @click="showAddModal"
      >
        <a
          class="btn-rounded rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          href="javascript:void(0)"
        >
          <img alt="icon plus" src="@/assets/images/icon-plus.svg" />
        </a>
        New Invoice
      </button>
    </div>
  </div>
</template>

<style scoped>
.invoice-header {
  display: flex;
}

.invoice-header .filter-invoice {
  color: var(--color-heading);
  background-color: #141625;
  border-color: #141625;
  width: 50%;
  float: left;
}

.add-invoice-btn .btn-rounded {
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
}

.add-invoice-btn .btn-rounded img {
  display: inline-block;
}

.details {
  margin-left: 1rem;
}

@media (min-width: 1024px) {
  /* .invoice-header {
      padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
    } */
}
</style>
