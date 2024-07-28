# frozen_string_literal: true

module Types
  class BaseEdge < GraphQL::Types::Relay::EdgeType
    node_type(Types::BaseObject)
  end
end