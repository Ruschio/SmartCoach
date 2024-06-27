<script setup lang="ts">
import WelcomeItem from '@/components/WelcomeItem.vue'
import DocumentationIcon from '@/components/icons/IconDocumentation.vue'
import ToolingIcon from '@/components/icons/IconTooling.vue'
import EcosystemIcon from '@/components/icons/IconEcosystem.vue'
import CommunityIcon from '@/components/icons/IconCommunity.vue'
import SupportIcon from '@/components/icons/IconSupport.vue'
</script>

<template>
  <div>
    <h2 class="mb-4">How the framework works?</h2>

    <WelcomeItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>Monitoring</template>

      Through a continuous monitoring of target smart contracts, our tool collects transactions
      other information from the Blockchain network for further operations.
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <ToolingIcon />
      </template>
      <template #heading>Analysis</template>

      By scanning the performed transactions the tool identifies possible unexpected behaviour, and
      analyzes the source code to discover vulnerabilities that need revision.
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <EcosystemIcon />
      </template>
      <template #heading>Update</template>

      Whenever an issue arises, the tool informs developers with useful insights the developer,
      helping them to resolve the problem by updating the original smart contract.
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <CommunityIcon />
      </template>
      <template #heading>Testing</template>

      The updates undergo some testing techniques performed by the tool to simulate transactions and
      capture the effects of changes on the smart contract code.
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <SupportIcon />
      </template>
      <template #heading>Evolution</template>

      Finally, if the refined logic is successfully tested, the smart contract can be updated,
      having a responsive evolution in the target Blockchain network.
    </WelcomeItem>
  </div>
</template>
